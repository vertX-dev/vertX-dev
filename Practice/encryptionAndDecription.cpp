#include <iostream>
#include <fstream>
#include <string>

char encryptChar(char c, int shift) {
    if (isalpha(c)) {
        char base = islower(c) ? 'a' : 'A';
        char mirrored = base + ('Z' - toupper(c));
        return base + (mirrored - base + shift) % 26;
    }
    return c;
}

int main() {
    std::string input;
    std::cout << "Enter text to encrypt (max 255 chars): ";
    std::getline(std::cin, input);
    if (input.length() > 255) input = input.substr(0, 255);

    std::string encrypted;
    int shift = 3;

    for (char c : input) {
        encrypted += encryptChar(c, shift);
    }

    std::ofstream outFile("encrypted.txt");
    if (outFile.is_open()) {
        outFile << encrypted;
        outFile.close();
        std::cout << "Encrypted text saved to encrypted.txt\n";
    } else {
        std::cerr << "Error writing to file.\n";
    }

    return 0;
}

#include <iostream>
#include <fstream>
#include <string>

char decryptChar(char c, int shift) {
    if (isalpha(c)) {
        char base = islower(c) ? 'a' : 'A';
        char unshifted = base + (c - base - shift + 26) % 26;
        return base + ('Z' - toupper(unshifted));
    }
    return c;
}

int main() {
    std::ifstream inFile("encrypted.txt");
    std::string encrypted;
    
    if (inFile.is_open()) {
        std::getline(inFile, encrypted);
        inFile.close();
    } else {
        std::cerr << "Error reading encrypted.txt\n";
        return 1;
    }

    std::string decrypted;
    int shift = 3;

    for (char c : encrypted) {
        decrypted += decryptChar(c, shift);
    }

    std::ofstream outFile("decrypted.txt");
    if (outFile.is_open()) {
        outFile << decrypted;
        outFile.close();
    } else {
        std::cerr << "Error writing decrypted.txt\n";
    }

    std::cout << "Decrypted text: " << decrypted << "\n";
    return 0;
}