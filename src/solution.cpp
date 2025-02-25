#include <iostream>
#include <cstdio>
#include <string>
#include <stdexcept>
#include <filesystem>
#include <fstream>

namespace fs = std::filesystem;

// to get the complete size of the file
long getFileSize(FILE *fp) {
    fseek(fp, 0, SEEK_END);
    long size = ftell(fp);
    fseek(fp, 0, SEEK_SET);
    return size;
}

/**
 * Adjust the given position to the start of the current line.
 * If the position is in the middle of a line, we backtrack until we find a newline character.
 */
long adjustToLineStart(FILE *fp, long pos) {
    if (pos == 0) return pos;
    char ch;
    while (pos > 0) {
        fseek(fp, pos - 1, SEEK_SET);
        if (fread(&ch, 1, 1, fp) != 1) break;
        if (ch == '\n') {
            break;
        }
        pos--;
    }
    return pos;
}

//to read the line from the file
std::string readLine(FILE *fp) {
    std::string line;
    int c;
    while ((c = fgetc(fp)) != EOF) {
        if (c == '\n')
            break;
        line.push_back(static_cast<char>(c));
    }
    return line;
}

//use binary search to get the starting index/offset for the given date
long binarySearchForDate(FILE *fp, const std::string &date, long fileSize) {
    long low = 0, high = fileSize;
    long candidate = -1;
    
    while (low < high) {
        long mid = (low + high) / 2;
        // Adjust mid to the beginning of a line
        long pos = adjustToLineStart(fp, mid);
        fseek(fp, pos, SEEK_SET);
        std::string line = readLine(fp);
        if (line.empty()) break; // Reached EOF or no valid line read
        std::string lineDate = line.substr(0, 10);
        
        if (lineDate < date) {
            low = pos + line.size() + 1; 
        } else { // Candidate found; narrow search to the left half.
            candidate = pos;
            high = pos;
        }
    }
    
    return (candidate != -1) ? candidate : low;
}

int main(int argc, char* argv[]) {

    //in case the arguements provided by user is not in the correct format
    if (argc != 3) {
        std::cerr << "Usage: ./log_extractor <log_file_path> <YYYY-MM-DD>" << std::endl;
        return 1;
    }
    
    std::string logFilePath = argv[1];
    std::string date = argv[2];

    // Open the log file in binary mode.
    FILE *fp = fopen(logFilePath.c_str(), "rb");
    if (!fp) {
        std::cerr << "Error: Could not open file " << logFilePath << std::endl;
        return 1;
    }
    
    long fileSize = getFileSize(fp);
    
    // Use binary search to find the starting offset for the target date.
    long startOffset = binarySearchForDate(fp, date, fileSize);
    fseek(fp, startOffset, SEEK_SET);
    
    // Ensure the output directory exists.
    std::string outputDir = "output";
    fs::create_directories(outputDir);
    std::string outputFilePath = outputDir + "/output_" + date + ".txt";
    std::ofstream outFile(outputFilePath);
    if (!outFile.is_open()) {
        std::cerr << "Error: Could not open output file " << outputFilePath << std::endl;
        fclose(fp);
        return 1;
    }
    
    bool found = false;
    // Read and output all log entries that match the target date.
    while (true) {
        long pos = ftell(fp);
        std::string line = readLine(fp);
        if (line.empty() && feof(fp)) break;  // End of file
        std::string lineDate = line.substr(0, 10);
        if (lineDate == date) {
            outFile << line << "\n";
            found = true;
        } else if (lineDate > date) {
            // Since logs are sorted by date, we can stop once the date is past our target.
            break;
        }
    }
    
    fclose(fp);
    outFile.close();
    
    if (found)
        std::cout << "Logs for " << date << " have been saved to " << outputFilePath << std::endl;
    else
        std::cout << "No logs found for " << date << std::endl;
    
    return 0;
}
