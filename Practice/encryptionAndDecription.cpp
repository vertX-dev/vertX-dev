#include <iostream>
#include <fstream>
#include <string>
#include <cstdlib>
#include <cctype>

using namespace std;

char encryptChar(char c, int shift) {
	if (isalpha(c)) {
		char base = islower(c) ? 'a' : 'A';
		char mirrored = base + ('Z' - toupper(c));
		return base + (mirrored - base + shift) % 26;
	}
	return c;
}

char decryptChar(char c, int shift) {
	if (isalpha(c)) {
		char base = islower(c) ? 'a' : 'A';
		char unshifted = base + (c - base - shift + 26) % 26;
		return base + ('Z' - toupper(unshifted));
	}
	return c;
}

int getShiftFromKey() {
	int key;
	cout << "Enter integer as key: ";
	cin >> key;
	srand(key);
	return rand() % 25;
}

string processText(const string& text, int shift, bool encryptMode) {
	string result;
	for (char c : text) {
		result += encryptMode ? encryptChar(c, shift) : decryptChar(c, shift);
	}
	return result;
}

void encrypt() {
	string input;
	cout << "Enter text to encrypt (max 255 chars): ";
	cin >> input;
	if (input.length() > 255) input = input.substr(0, 255);

	int shift = getShiftFromKey();
	string encrypted = processText(input, shift, true);

	ofstream outFile("encrypted.txt");
	if (outFile.is_open()) {
		outFile << encrypted;
		outFile.close();
		cout << "Encrypted text saved to encrypted.txt\n";
	} else {
		cerr << "Error writing to file.\n";
	}
}

void decrypt() {
	ifstream inFile("encrypted.txt");
	string encrypted;

	if (inFile.is_open()) {
		getline(inFile, encrypted);
		inFile.close();
	} else {
		cerr << "Error reading encrypted.txt\n";
		return;
	}

	int shift = getShiftFromKey();
	string decrypted = processText(encrypted, shift, false);

	ofstream outFile("decrypted.txt");
	if (outFile.is_open()) {
		outFile << decrypted;
		outFile.close();
	} else {
		cerr << "Error writing decrypted.txt\n";
	}

	cout << "Decrypted text: " << decrypted << "\n";
}

int main() {
	char c;
	cout << "Encrypt(e) or decrypt(d): ";
	cin >> c;
	switch (c) {
		case 'e':
			encrypt();
			break;
		case 'd':
			decrypt();
			break;
		default:
			cout << "Error";
	}
}