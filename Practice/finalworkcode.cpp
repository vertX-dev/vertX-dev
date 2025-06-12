#include <iostream>
#include <string>
#include <map>
#include <cctype>
#include <algorithm>
#include <fstream>
#include <vector>

using namespace std;

// ================= MAGIC SQUARE =================
int magicSquare[3][3] = {
    {8, 1, 6},
    {3, 5, 7},
    {4, 9, 2}
};

string encryptMagicSquare(const string &msg) {
    string result = "";
    string text = msg;
    
    // Process text in chunks of 9 characters
    for (size_t i = 0; i < text.length(); i += 9) {
        string chunk = text.substr(i, 9);
        
        // Pad chunk to 9 characters if needed
        while (chunk.size() < 9) chunk += ' ';
        
        char square[3][3];
        for (int j = 1; j <= 9; ++j) {
            for (int r = 0; r < 3; ++r) {
                for (int c = 0; c < 3; ++c) {
                    if (magicSquare[r][c] == j) {
                        square[r][c] = chunk[j - 1];
                    }
                }
            }
        }
        
        // Read encrypted chunk row by row
        for (int r = 0; r < 3; ++r) {
            for (int c = 0; c < 3; ++c) {
                result += square[r][c];
            }
        }
    }
    
    return result;
}

string decryptMagicSquare(const string &cipher) {
    string result = "";
    
    // Process cipher in chunks of 9 characters
    for (size_t i = 0; i < cipher.length(); i += 9) {
        string chunk = cipher.substr(i, 9);
        
        if (chunk.size() < 9) {
            result += "Incomplete chunk in Magic Square decryption.";
            break;
        }
        
        char square[3][3];
        int idx = 0;
        for (int r = 0; r < 3; ++r) {
            for (int c = 0; c < 3; ++c) {
                square[r][c] = chunk[idx++];
            }
        }
        
        char decrypted[9];
        for (int j = 1; j <= 9; ++j) {
            for (int r = 0; r < 3; ++r) {
                for (int c = 0; c < 3; ++c) {
                    if (magicSquare[r][c] == j) {
                        decrypted[j - 1] = square[r][c];
                    }
                }
            }
        }
        
        result += string(decrypted, 9);
    }
    
    return result;
}

// ================= POLYBIUS SQUARE =================
char polybiusSquare[5][5] = {
    {'A','B','C','D','E'},
    {'F','G','H','I','K'},
    {'L','M','N','O','P'},
    {'Q','R','S','T','U'},
    {'V','W','X','Y','Z'}
};

map<char, string> createPolybiusMap() {
    map<char, string> polyMap;
    for (int r = 0; r < 5; ++r)
        for (int c = 0; c < 5; ++c)
            polyMap[polybiusSquare[r][c]] = to_string(r + 1) + to_string(c + 1);
    polyMap['J'] = polyMap['I']; // Treat J as I
    return polyMap;
}

string encryptPolybius(const string &text) {
    map<char, string> polyMap = createPolybiusMap();
    string cipher = "";

    for (char ch : text) {
        ch = toupper(ch);
        if (ch >= 'A' && ch <= 'Z') {
            cipher += polyMap[ch];
        }
    }
    return cipher;
}

string decryptPolybius(const string &cipher) {
    string text = "";
    for (size_t i = 0; i + 1 < cipher.size(); i += 2) {
        int row = cipher[i] - '1';
        int col = cipher[i + 1] - '1';
        if (row >= 0 && row < 5 && col >= 0 && col < 5)
            text += polybiusSquare[row][col];
    }
    return text;
}

// ================= COMBINED CIPHER =================
string encryptCombined(const string &text) {
    string magicResult = encryptMagicSquare(text);
    return encryptPolybius(magicResult);
}

string decryptCombined(const string &cipher) {
    string polybiusResult = decryptPolybius(cipher);
    return decryptMagicSquare(polybiusResult);
}

// ================= UTILITY FUNCTIONS =================
string cleanInput(const string &input) {
    string cleaned = input;
    
    // Remove control characters like ^C, ^V, ^@, etc.
    cleaned.erase(remove_if(cleaned.begin(), cleaned.end(), [](char ch) {
        return ch < 32 && ch != '\t' && ch != '\n' && ch != '\r';
    }), cleaned.end());
    
    return cleaned;
}

void saveToFile(const string &result, const string &operation) {
    string filename;
    cout << "Enter filename to save (with extension): ";
    getline(cin, filename);
    filename = cleanInput(filename);
    
    if (filename.empty()) {
        cout << "Invalid filename. Result not saved.\n";
        return;
    }
    
    ofstream file(filename);
    if (file.is_open()) {
        file << operation << " Result:\n";
        file << result << endl;
        file.close();
        cout << "Result saved to " << filename << endl;
    } else {
        cout << "Error: Could not save to file.\n";
    }
}

bool askContinue() {
    char choice;
    cout << "\nWhat would you like to do?\n";
    cout << "1. Continue with another operation\n";
    cout << "2. Save result to file\n";
    cout << "3. Save result and continue\n";
    cout << "4. Exit\n";
    cout << "Enter choice (1-4): ";
    cin >> choice;
    cin.ignore(); // flush newline
    
    return choice == '1' || choice == '3';
}

// ================= MAIN INTERFACE =================
int main() {
    cout << "=== Enhanced Cipher Program ===\n";
    cout << "Features: Magic Square, Polybius Square, and Combined Ciphers\n\n";
    
    while (true) {
        cout << "Choose Cipher Method:\n";
        cout << "1. Magic Square Cipher (supports any length)\n";
        cout << "2. Polybius Square Cipher\n";
        cout << "3. Combined Cipher (Magic Square + Polybius Square)\n";
        cout << "4. Quit\n";
        cout << "Enter choice (1-4): ";
        
        int cipherChoice;
        cin >> cipherChoice;
        
        if (cipherChoice == 4) {
            cout << "Goodbye!\n";
            break;
        }
        
        if (cipherChoice < 1 || cipherChoice > 4) {
            cout << "Invalid cipher selection. Please try again.\n\n";
            continue;
        }
        
        cout << "Choose Operation:\n";
        cout << "1. Encrypt\n";
        cout << "2. Decrypt\n";
        cout << "Enter choice (1 or 2): ";
        
        int operation;
        cin >> operation;
        
        if (operation != 1 && operation != 2) {
            cout << "Invalid operation. Please try again.\n\n";
            continue;
        }
        
        cin.ignore(); // flush newline
        
        string inputText;
        cout << "Enter text: ";
        getline(cin, inputText);
        
        // Clean input to remove control characters
        inputText = cleanInput(inputText);
        
        if (inputText.empty()) {
            cout << "No valid input provided. Please try again.\n\n";
            continue;
        }
        
        string result;
        string cipherName;
        
        switch (cipherChoice) {
            case 1: // Magic Square
                cipherName = "Magic Square";
                if (operation == 1) {
                    result = encryptMagicSquare(inputText);
                } else {
                    result = decryptMagicSquare(inputText);
                }
                break;
                
            case 2: // Polybius Square
                cipherName = "Polybius Square";
                if (operation == 1) {
                    result = encryptPolybius(inputText);
                } else {
                    result = decryptPolybius(inputText);
                }
                break;
                
            case 3: // Combined
                cipherName = "Combined (Magic + Polybius)";
                if (operation == 1) {
                    result = encryptCombined(inputText);
                } else {
                    result = decryptCombined(inputText);
                }
                break;
        }
        
        cout << "\n=== RESULT ===\n";
        cout << "Cipher: " << cipherName << endl;
        cout << "Operation: " << (operation == 1 ? "Encryption" : "Decryption") << endl;
        cout << "Input: " << inputText << endl;
        cout << "Output: " << result << endl;
        cout << "==============\n";
        
        // Ask what to do next
        char nextChoice;
        cout << "\nWhat would you like to do?\n";
        cout << "1. Continue with another operation\n";
        cout << "2. Save result to file\n";
        cout << "3. Save result and continue\n";
        cout << "4. Exit\n";
        cout << "Enter choice (1-4): ";
        cin >> nextChoice;
        cin.ignore(); // flush newline
        
        bool shouldContinue = false;
        
        switch (nextChoice) {
            case '1':
                shouldContinue = true;
                break;
                
            case '2':
                saveToFile(result, cipherName + " " + (operation == 1 ? "Encryption" : "Decryption"));
                shouldContinue = false;
                break;
                
            case '3':
                saveToFile(result, cipherName + " " + (operation == 1 ? "Encryption" : "Decryption"));
                shouldContinue = true;
                break;
                
            case '4':
                shouldContinue = false;
                break;
                
            default:
                cout << "Invalid choice. Continuing...\n";
                shouldContinue = true;
                break;
        }
        
        if (!shouldContinue) {
            cout << "Goodbye!\n";
            break;
        }
        
        cout << "\n" << string(50, '=') << "\n\n";
    }
    
    return 0;
}