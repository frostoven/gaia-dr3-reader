// Compile with: gcc -o main main.c -lz

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <zlib.h>
#include <time.h>

#define BUFFER_SIZE 1024

typedef struct {
    uint8_t* data;
    size_t size;
} ByteVector;

ByteVector bufferToLineStrings(const uint8_t* buffer, size_t buffer_size) {
    ByteVector stringParts;
    stringParts.data = NULL;
    stringParts.size = 0;

    uint8_t* currentLine = NULL;
    size_t currentLineSize = 0;
    int isComment = 0;
    int lineLogCount = 0;

    for (size_t i = 0; i < buffer_size; i++) {
        uint8_t c = buffer[i];

        if (isComment) {
            if (c == 10 || c == 13) {
                isComment = 0;
            }
            continue;
        }

        if (c == 35 && currentLineSize == 0) {
            isComment = 1;
            continue;
        }

        if (c == 10 || c == 13) {
            if (currentLineSize > 0) {
                stringParts.size++;
                stringParts.data = (uint8_t*)realloc(stringParts.data, stringParts.size * sizeof(uint8_t*));
                stringParts.data[stringParts.size - 1] = currentLine;
                currentLine = NULL;
                currentLineSize = 0;
                if (++lineLogCount == 10000) {
                    lineLogCount = 0;
                    printf("Found %zu items.\n", stringParts.size);
                }
            }
        } else {
            currentLineSize++;
            currentLine = (uint8_t*)realloc(currentLine, currentLineSize * sizeof(uint8_t));
            currentLine[currentLineSize - 1] = c;
        }
    }

    return stringParts;
}

int main() {
    const char* filePath = "/tmp/test1.csv.gz";
    FILE* file = fopen(filePath, "rb");

    if (!file) {
        fprintf(stderr, "Error opening file.\n");
        return 1;
    }

    fseek(file, 0, SEEK_END);
    long fileSize = ftell(file);
    fseek(file, 0, SEEK_SET);

    uint8_t* buffer = (uint8_t*)malloc(fileSize);
    if (fread(buffer, 1, fileSize, file)) {
        printf("File read successfully.\n");

        printf("Starting inflate...\n");
        clock_t start = clock();

        z_stream stream;
        stream.zalloc = Z_NULL;
        stream.zfree = Z_NULL;
        stream.opaque = Z_NULL;
        stream.avail_in = (uInt)fileSize;
        stream.next_in = buffer;

        if (inflateInit2(&stream, 15 + 16) != Z_OK) {
            fprintf(stderr, "Error initializing zlib.\n");
            return 1;
        }

        size_t inflatedBufferSize = fileSize * 10; // Adjust the factor as needed
        uint8_t* inflatedBuffer = (uint8_t*)malloc(inflatedBufferSize);
        stream.avail_out = (uInt)inflatedBufferSize;
        stream.next_out = inflatedBuffer;

        if (inflate(&stream, Z_FINISH) != Z_STREAM_END) {
            fprintf(stderr, "Error inflating data.\n");
            return 1;
        }

        if (inflateEnd(&stream) != Z_OK) {
            fprintf(stderr, "Error ending inflation.\n");
            return 1;
        }

        inflatedBufferSize = stream.total_out;

        printf("Inflate buffer size: %zu\n", inflatedBufferSize);
        clock_t end = clock();
        printf("Inflation time: %f ms\n", ((double)(end - start) * 1000) / CLOCKS_PER_SEC);

        start = clock();
        ByteVector result = bufferToLineStrings(inflatedBuffer, inflatedBufferSize);
        end = clock();

        printf("Time taken: %f ms\n", ((double)(end - start) * 1000) / CLOCKS_PER_SEC);
        printf("Number of items: %zu\n", result.size);

        free(result.data);
        free(inflatedBuffer);
    } else {
        fprintf(stderr, "Error reading file.\n");
        return 1;
    }

    fclose(file);
    free(buffer);

    return 0;
}
