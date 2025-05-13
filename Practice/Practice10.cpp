#include "stdafx.h"
#include <iostream>
#include <cmath>

using namespace std;

double f(double u, double t) {
	if (u >= 0) {
		return u - t;
	} else if (u <= -3) {
		return u + t;
	} else if (u > -3 && u < 0) {
		return u + 2 * t - 1;
	}
}

int main()
{
	double x, y, a, b;
	cout << "Enter x, y, a, b: ";
	cin >> x >> y >> a >> b;

	double z = 0;
	z += f(pow(x, 3), pow(y, 3));
	z += f(a, b*b);
	z += f(pow(x, 4) + 1, -y);
	z += f(x*x - pow(y, 3), y);
	z += f(x - y, a - b);


	cout << "Z = "<<z<<endl;
	return 0;
}

