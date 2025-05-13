#include <iostream>
#include <cstdlib>   // for rand() and srand()
#include <ctime>     // for time()
#include <cmath>     // for pow()

using namespace std;

int main() {
    // Define dimensions
    const int rows1 = 2, cols1 = 3;
    const int rows2 = 3, cols2 = 2;

    // Declare the arrays
    double array1[rows1][cols1];
    double array2[rows2][cols2] = {
        {1.1, 2.2},
        {3.3, 4.4},
        {5.5, 6.6}
    };

    // Seed the random number generator
    srand(static_cast<unsigned int>(time(0)));

    // Fill the first array with random real numbers between 0 and 10
    cout << "Array 1:" << endl;
    for (int i = 0; i < rows1; i++) {
        for (int j = 0; j < cols1; j++) {
            array1[i][j] = static_cast<double>(rand()) / RAND_MAX * 10;
            cout << array1[i][j] << " ";
        }
        cout << endl;
    }

    // Display second array
    cout << "\nArray 2:" << endl;
    for (int i = 0; i < rows2; i++) {
        for (int j = 0; j < cols2; j++) {
            cout << array2[i][j] << " ";
        }
        cout << endl;
    }

    // Calculate sum of squares of the second row of the first array
    double sum1 = 0;
    for (int j = 0; j < cols1; j++) {
        sum1 += pow(array1[1][j], 2);
    }

    // Calculate sum of squares of the first row of the second array
    double sum2 = 0;
    for (int j = 0; j < cols2; j++) {
        sum2 += pow(array2[0][j], 2);
    }

    // Output results
    cout << "\nSum of squares of the second row of the first array: " << sum1 << endl;
    cout << "Sum of squares of the first row of the second array: " << sum2 << endl;

    return 0;
}