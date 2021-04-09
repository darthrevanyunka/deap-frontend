import { Component, OnInit } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from '../services/encryption.service';
import { environment } from '../../environments/environment';
import { Employee } from '../shared/employee.model'

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [EncryptionService]
})
export class EmployeeComponent implements OnInit {

  currentApplicationVersion = environment.appVersion;
  employee : Employee[] = [];

  constructor(private http: HttpClient, private encryptionService: EncryptionService) { }

  onShowAll(){
        this.http.get<Employee[]>('http://localhost:8080/employee/get',
        ).subscribe(responseData => {
            this.employee = responseData;
            console.log(this.employee);
        });
  }

  ngOnInit(): void {
  }

  onDeleteEmployee(deleteForm){
    const formDelete = deleteForm.value;
    const email = formDelete.emailDel;
    const url = `http://localhost:8080/employee/delete/${email}`;

    this.http.delete(url,
      ).subscribe(responseData => {
       console.log(responseData);
      });
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

        const encryptedPassword = this.encryptionService.encrypt(password);

        console.log("password: " + password);
        console.log("Encrypted AES256 Password : " + encryptedPassword);

        const decryptedPassword = this.encryptionService.decrypt(encryptedPassword);
        console.log("Decrypted Password: " + decryptedPassword);

        const passwordBase64 = btoa(encryptedPassword);
        console.log("Encrypted Password as base 64:" + passwordBase64);

        //create employee object
        const employee = {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: passwordBase64
        }
        console.log(employee);

        //convert employee object to JSON
        const employeeJson = JSON.stringify(employee);
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

