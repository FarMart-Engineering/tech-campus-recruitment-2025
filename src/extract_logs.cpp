#include <iostream>
#include <fstream>
#include <string>
#include <sstream>

using namespace std;

int main(int argc, char* argv[]) {
    if (argc != 2) {
        cerr << "Usage: " << argv[0] << " YYYY-MM-DD" << endl;
        return 1;
    }

    string date = argv[1];  

    string logFile = "logs_2024.log"; 

    ifstream file(logFile);
    if (!file) {
        cerr << "Error: Could not open log file '" << logFile << "'" << endl;
        return 1;
    }

    string outputFile = "output/output_" + date + ".txt";
    ofstream outFile(outputFile);
    if (!outFile) {
        cerr << "Error: Could not create output file '" << outputFile << "'" << endl;
        return 1;
    }

    string line;
    while (getline(file, line)) {
        if (line.rfind(date, 0) == 0) { 
            outFile << line << '\n';
        }
    }

    cout << "Logs for " << date << " extracted successfully in: " << outputFile << endl;

    file.close();
    outFile.close();
    return 0;
}
