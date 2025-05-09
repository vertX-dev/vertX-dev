// ConsoleApplicationed.cpp: определяет точку входа для консольного приложения.
//

#include "stdafx.h"
#include <iostream>
#include <fstream>
#include <string>
#include <cstdlib>

char encryptChar(char c, int shift) {
	if (isalpha(c)) {
		char base = islower(c) ? 'a' : 'A';
		char mirrored = base + ('Z' - toupper(c));
		return base + (mirrored - base + shift) % 26;
	}
	return c;
}

void encrypt() {
	std::string input;
	std::cout << "Enter text to encrypt (max 255 chars): ";
	std::cin >> input;
	if (input.length() > 255) input = input.substr(0, 255);

	std::string encrypted;
	int shift, key;
	std::cout << "Enter integer as key: ";
	std::cin >> key;
	srand(key);
	shift = rand() % 25;


	for (char c : input) {
		encrypted += encryptChar(c, shift);
	}

	std::ofstream outFile("encrypted.txt");
	if (outFile.is_open()) {
		outFile << encrypted;
		outFile.close();
		std::cout << "Encrypted text saved to encrypted.txt\n";
	}
	else {
		std::cerr << "Error writing to file.\n";
	}
}


char decryptChar(char c, int shift) {
	if (isalpha(c)) {
		char base = islower(c) ? 'a' : 'A';
		char unshifted = base + (c - base - shift + 26) % 26;
		return base + ('Z' - toupper(unshifted));
	}
	return c;
}

void decrypt() {
	std::ifstream inFile("encrypted.txt");
	std::string encrypted;

	if (inFile.is_open()) {
		std::getline(inFile, encrypted);
		inFile.close();
	}
	else {
		std::cerr << "Error reading encrypted.txt\n";
	}

	std::string decrypted;
	int shift, key;
	std::cout << "Enter integer as key: ";
	std::cin >> key;
	srand(key);
	shift = rand() % 25;

	for (char c : encrypted) {
		decrypted += decryptChar(c, shift);
	}

	std::ofstream outFile("decrypted.txt");
	if (outFile.is_open()) {
		outFile << decrypted;
		outFile.close();
	}
	else {
		std::cerr << "Error writing decrypted.txt\n";
	}

	std::cout << "Decrypted text: " << decrypted << "\n";
}


int main() {
	char c;
	std::cout << "Encrypt(e) or decrypt(d): ";
	std::cin >> c;
	switch (c) {
		case 'e':
			encrypt();
			break;
		case 'd':
			decrypt();
			break;
		default:
			std::cout << "Error";
	}
}
