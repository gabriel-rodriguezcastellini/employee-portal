## Project Architecture & Overview

This employee portal is a React-based application bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It uses [react-router-dom](src/App.js) for client-side routing with three main pages:

- [`EmployeeList`](src/pages/EmployeeList.jsx) displays the list of employees.
- [`NewEmployee`](src/pages/NewEmployee.jsx) handles adding a new employee.
- [`EmployeeDetails`](src/pages/EmployeeDetails.jsx) shows detailed information and allows updates for a selected employee.

Data is fetched and manipulated via [axios](src/pages/EmployeeDetails.jsx) using a REST API with the base URL configured in the [.env](.env) file. Tailwind CSS (configured in [tailwind.config.js](tailwind.config.js)) is used for styling the UI.

This architecture enables separation of concerns and scalability for managing employee data in a user-friendly interface.
