// Compile with: g++ -o main perf_test.cpp -lz

#include <iostream>
#include <fstream>
#include <vector>
#include <zlib.h>
#include <chrono>

std::vector<std::vector<unsigned char>> bufferToLineStrings(const std::vector<unsigned char>& buffer) {
    std::vector<std::vector<unsigned char>> stringParts;
    std::vector<unsigned char> currentLine;
    bool isComment = false;
    int lineLogCount = 0;

    for (size_t i = 0; i < buffer.size(); i++) {
        unsigned char c = buffer[i];

        if (isComment) {
            if (c == 10 || c == 13) {
                isComment = false;
            }
            continue;
        }

        if (c == 35 && currentLine.empty()) {
            isComment = true;
            continue;
        }

        if (c == 10 || c == 13) {
            if (!currentLine.empty()) {
                stringParts.push_back(currentLine);
                currentLine.clear();
                if (++lineLogCount == 10000) {
                    lineLogCount = 0;
                    std::cout << "Found " << stringParts.size() << " items." << std::endl;
                }
            }
        } else {
            currentLine.push_back(c);
        }
    }

    return stringParts;
}

int main() {
    std::string filePath = "/tmp/test1.csv.gz";
    std::ifstream file(filePath, std::ios::binary);

    if (!file.is_open()) {
        std::cerr << "Error opening file." << std::endl;
        return 1;
    }

    file.seekg(0, std::ios::end);
    std::streamsize fileSize = file.tellg();
    file.seekg(0, std::ios::beg);

    std::vector<unsigned char> buffer(fileSize);
    if (file.read(reinterpret_cast<char*>(&buffer[0]), fileSize)) {
        std::cout << "File read successfully." << std::endl;

        std::cout << "Starting inflate..." << std::endl;
        auto start = std::chrono::high_resolution_clock::now();

        z_stream stream;
        stream.zalloc = Z_NULL;
        stream.zfree = Z_NULL;
        stream.opaque = Z_NULL;
        stream.avail_in = static_cast<uInt>(fileSize);
        stream.next_in = reinterpret_cast<Bytef*>(&buffer[0]);

        if (inflateInit2(&stream, 15 + 16) != Z_OK) {
            std::cerr << "Error initializing zlib." << std::endl;
            return 1;
        }

        std::vector<unsigned char> inflatedBuffer(fileSize * 10); // Adjust the factor as needed
        stream.avail_out = static_cast<uInt>(inflatedBuffer.size());
        stream.next_out = reinterpret_cast<Bytef*>(&inflatedBuffer[0]);

        if (inflate(&stream, Z_FINISH) != Z_STREAM_END) {
            std::cerr << "Error inflating data." << std::endl;
            return 1;
        }

        if (inflateEnd(&stream) != Z_OK) {
            std::cerr << "Error ending inflation." << std::endl;
            return 1;
        }

        inflatedBuffer.resize(stream.total_out);

        std::cout << "Inflate buffer size: " << inflatedBuffer.size() << std::endl;
        auto end = std::chrono::high_resolution_clock::now();
        std::cout << "Inflation time: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << " ms" << std::endl;

        start = std::chrono::high_resolution_clock::now();
        auto result = bufferToLineStrings(inflatedBuffer);
        end = std::chrono::high_resolution_clock::now();

        std::cout << "Time taken: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << " ms" << std::endl;
        std::cout << "Number of items: " << result.size() << std::endl;
    } else {
        std::cerr << "Error reading file." << std::endl;
        return 1;
    }

    return 0;
}
