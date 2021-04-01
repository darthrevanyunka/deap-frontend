import { Component, OnInit } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  onCreateEmployee(employeeForm){
    //put form values into variables
    const formEmployee = employeeForm.value;
    const email = formEmployee.email;
    const firstName = formEmployee.firstName;
    const lastName = formEmployee.lastName;
    const password = formEmployee.password;
    const confPassword = formEmployee.confirmPassword;

    //check whether passwords match
    if(password == confPassword){

        //create employee object
        const employee = {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: password
        }

        //convert employee object to JSON
        const employeeJson = JSON.stringify(employee);

        //loggers
        console.log(employee);
        console.log(employeeJson);

        //post request to create employee
        this.http.post('http://localhost:8080/employee/registration',
        employee
        ).subscribe(responseData => {
            console.log(responseData);
        });

    }else{
      console.log("Passwords do not match");
      alert("Passwords do not match");
    }
  }
}

