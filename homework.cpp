#include <iostream>
#include <string>

// Task #1:
int calculate(int a, int b, char operation) {
    switch (operation) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            if (b == 0) {
                std::cout << "Error: Division by zero" << std::endl;
                return 0;
            }
            return a / b;  // Integer division
        case '%':
            if (b == 0) {
                std::cout << "Error: Modulo by zero" << std::endl;
                return 0;
            }
            return a % b;  // Remainder
        default:
            std::cout << "Error: Invalid operation" << std::endl;
            return 0;
    }
}

// Task #2: 
enum class Animal {
    PIG,
    CHICKEN,
    GOAT,
    CAT,
    DOG,
    OSTRICH,
    UNKNOWN
};

std::string getAnimalName(Animal animal) {
    switch (animal) {
        case Animal::PIG:
            return "pig";
        case Animal::CHICKEN:
            return "chicken";
        case Animal::GOAT:
            return "goat";
        case Animal::CAT:
            return "cat";
        case Animal::DOG:
            return "dog";
        case Animal::OSTRICH:
            return "ostrich";
        default:
            return "unknown animal";
    }
}

void printNumberOfLegs(Animal animal) {
    std::string animalName = getAnimalName(animal);
    
    switch (animal) {
        case Animal::PIG:
            std::cout << "A " << animalName << " has 4 legs." << std::endl;
            break;
        case Animal::CHICKEN:
            std::cout << "A " << animalName << " has 2 legs." << std::endl;
            break;
        case Animal::GOAT:
            std::cout << "A " << animalName << " has 4 legs." << std::endl;
            break;
        case Animal::CAT:
            std::cout << "A " << animalName << " has 4 legs." << std::endl;
            break;
        case Animal::DOG:
            std::cout << "A " << animalName << " has 4 legs." << std::endl;
            break;
        case Animal::OSTRICH:
            std::cout << "A " << animalName << " has 2 legs." << std::endl;
            break;
        default:
            std::cout << "Error: Unknown animal type" << std::endl;
            break;
    }
}

int main() {
    // Task #1
    int num1,  num2;
    char op;
    std::cin>>num1;
    std::cin>>op;
    std::cin>>num2;
    
    std::cout << num1 << " " << op << " " << num2 << " = " << calculate(num1, num2, op) << std::endl;
    
    // Task #2 
    printNumberOfLegs(Animal::CAT);
    printNumberOfLegs(Animal::CHICKEN);
    
    return 0;
}
