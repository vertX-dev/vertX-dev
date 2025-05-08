#include <iostream>
#include <cstdlib>
#include <ctime>

using namespace std;

int main() {
    const int rows = 4;  // Кількість рядків
    const int cols = 5;  // Кількість стовпців
    int array[rows][cols];

    srand(time(0));  // Ініціалізація генератора випадкових чисел

    // Заповнення масиву випадковими числами в діапазоні [-5, 5]
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            array[i][j] = rand() % 11 - 5;
        }
    }

    // Вивід масиву по рядках
    cout << "Масив:\n";
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            cout << array[i][j] << "\t";
        }
        cout << endl;
    }

    // Обчислення суми двох будь-яких елементів третього стовпця (індекс 2)
    int sum = array[0][2] + array[2][2];  // Наприклад, перший і третій елементи
    cout << "Сума 1-го і 3-го елементів третього стовпця: " << sum << endl;

    return 0;
}