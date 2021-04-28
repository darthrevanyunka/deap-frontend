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

  employee : Employee[] = [];
  showAll = false;

  constructor(private http: HttpClient, private encryptionService: EncryptionService) { }

  onShowAll(){
        this.http.get<Employee[]>('http://localhost:9090/employee/get',
        ).subscribe(responseData => {
            this.employee = responseData;
        });

        if(this.showAll==true){
          this.showAll = false;
          this.showEdit = false;
        }
        else this.showAll = true;
        console.log(this.employee);
  }

  ngOnInit(): void {
  }

  showEdit = false;
  showEmployeeForm = false;
  employeeToEdit = 0;

  onClickEmployee(){
    this.showEdit = true;
  }

  onEditEmployee(i){
    this.employeeToEdit = i;
    this.showEmployeeForm = true;
  }

  onSubmitChangeEmployeeForm(changeForm){
  }

  onDeleteEmployee(deleteForm){
    const formDelete = deleteForm.value;
    const email = formDelete.emailDel;
    const url = `http://localhost:9090/employee/delete/${email}`;

    this.http.delete(url,
      ).subscribe(responseData => {
       console.log(responseData);
      });

    var contains = false;
    for(var i=0; i<this.employee.length; i++){
      if(this.employee[i].email === email){
      this.employee.splice(i, 1);
      contains = true;
      };
    }
    if(contains===false) alert("No such Email");
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
        const newEmployee = {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: passwordBase64
        }
        console.log(newEmployee);

        //convert employee object to JSON
        const employeeJson = JSON.stringify(newEmployee);
        console.log(employeeJson);

        //post request to create employee
        this.http.post('http://localhost:9090/employee/registration',
        newEmployee
        ).subscribe(responseData => {
            console.log(responseData);
        });

        var containsEmail = false;

        for(var i=0; i<this.employee.length; i++){
         if(this.employee[i].email === email){
           containsEmail = true;
           }
         }

         if(containsEmail) alert("Email Already Taken");
         else this.employee.push(newEmployee);

    }else{
      console.log("Passwords do not match");
      alert("Passwords do not match");
    }
  }
}

