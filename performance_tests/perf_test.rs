// Cargo.toml:
// [dependencies]
// flate2 = "1.0"
//
// Build:
// cargo build
// cargo run

use std::fs::File;
use std::io::{Read, Write};
use std::time::Instant;
use flate2::read::GzDecoder;

fn buffer_to_line_strings(buffer: &[u8]) -> Vec<Vec<u8>> {
    let mut string_parts = Vec::new();
    let mut current_line = Vec::new();
    let mut is_comment = false;
    let mut line_log_count = 0;

    for &char in buffer.iter() {
        if is_comment {
            if char == 10 || char == 13 {
                is_comment = false;
            }
            continue;
        }

        if char == 35 && current_line.is_empty() {
            is_comment = true;
            continue;
        }

        if char == 10 || char == 13 {
            if !current_line.is_empty() {
                string_parts.push(current_line.clone());
                current_line.clear();
                line_log_count += 1;
                if line_log_count == 10000 {
                    line_log_count = 0;
                    println!("Found {} items.", string_parts.len());
                }
            }
        } else {
            current_line.push(char);
        }
    }

    string_parts
}

fn main() -> std::io::Result<()> {
    let file_path = "/tmp/test1.csv.gz";
    let mut file = File::open(file_path)?;

    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)?;

    println!("file read");

    println!("starting deflate...");
    let start = Instant::now();
    let mut decoder = GzDecoder::new(&buffer[..]);
    let mut result = Vec::new();
    decoder.read_to_end(&mut result)?;
    println!("deflation time: {:?}", Instant::now() - start);

    let start = Instant::now();
    let _line_strings = buffer_to_line_strings(&result);
    println!("Time taken: {:?}", Instant::now() - start);

    Ok(())
}
