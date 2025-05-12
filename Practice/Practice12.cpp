#include <iostream>
#include <fstream>
#include <vector>

using namespace std;

bool isVowel(char c) {
    c = tolower(c);
    return (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u');
}

bool isPalindrome(const string &word) {
    string cleaned = "";
    for (int i = 0; i < word.length(); i++) {
        if (isalpha(word[i])) {
            cleaned += tolower(word[i]);
        }
    }

    int n = cleaned.length();
    for (int i = 0; i < n / 2; i++) {
        if (cleaned[i] != cleaned[n - 1 - i])
            return false;
    }
    return n > 0;
}

int main() {
    ifstream infile("input.txt");
    ofstream outfile("output.txt");

    if (!infile.is_open() || !outfile.is_open()) {
        cerr << "Error opening input or output file." << endl;
        return 1;
    }

    string word;
    vector<string> words;
    int equalCount = 0;
    string longest = "";

    while (infile >> word) {
        int vowels = 0, consonants = 0;
        for (int i = 0; i < word.length(); i++) {
            if (isalpha(word[i])) {
                if (isVowel(word[i]))
                    vowels++;
                else
                    consonants++;
            }
        }

        if (vowels == consonants && (vowels + consonants) > 0)
            equalCount++;

        if (word.length() > longest.length())
            longest = word;

        if (!isPalindrome(word))
            words.push_back(word);
    }

    // a) Output count
    cout << "Words with equal vowels and consonants: " << equalCount << endl;
    outfile << "Words with equal vowels and consonants: " << equalCount << endl;

    // b) Longest word
    cout << "Longest word: " << longest << endl;
    outfile << "Longest word: " << longest << endl;

    // c) Words without palindromes
    cout << "Text without palindromic words:" << endl;
    outfile << "Text without palindromic words:" << endl;

    for (int i = 0; i < words.size(); i++) {
        cout << words[i] << " ";
        outfile << words[i] << " ";
    }
    cout << endl;
    outfile << endl;

    infile.close();
    outfile.close();
    return 0;
}