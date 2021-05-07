import { Component, OnInit } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from '../services/encryption.service';
import { environment } from '../../environments/environment';
import { Employee } from '../shared/employee.model'
import { AppComponent } from '../app.component'

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  providers: [EncryptionService]
})
export class EmployeeComponent implements OnInit {

  employee : Employee[] = [];
  showAll = false;
  employeeName : Employee[];
  employeeJson: any;
  isLoading: boolean = true;


  editEmail: String;
  editFirstName: String;
  editLastName: String;
  loginName: String;
  userName: String;
  idEdit: String;


  constructor(private appComponent: AppComponent, private http: HttpClient, private encryptionService: EncryptionService) { }

  onShowName(){
    this.isLoading=true;
    this.http.get<Employee[]>('https://springbootkeycloak.herokuapp.com/employee/name',
                              
    ).subscribe(responseData => {
      this.employeeJson = JSON.stringify(responseData);
      this.loginName = responseData[0].firstName;
    });
    this.isLoading = false;
}

  onShowAll(){
      this.isLoading=true;
        this.http.get<Employee[]>('https://springbootkeycloak.herokuapp.com/employee/get',
                                  
        ).subscribe(responseData => {
            this.employee = responseData;
        });

        if(this.showAll==true){
          this.showAll = false;
          this.showEdit = false;
          this.showEmployeeForm = false;
        }
        else this.showAll = true;
//         setTimeout(() => {
//           this.isLoading = false;
//         }, 5000);
        this.isLoading = false;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.onShowName();
    var Json = JSON.parse(this.employeeJson);
    this.userName = this.appComponent.userName;
    this.isLoading = false;
  }

  showEdit = false;
  showEmployeeForm = false;
  employeeToEdit = 0;
  showRegister = false;
  showDelete = false;

  onClickEmployee(){
    this.showEdit = true;
  }

  onClickRegister(){
    if(this.showRegister==true) this.showRegister = false;
    else this.showRegister = true;
  }

  onClickDelete(){
        if(this.showDelete==true) this.showDelete = false;
        else this.showDelete = true;
  }

    onEditEmployee(i){
      this.isLoading = true;
      this.employeeToEdit = i;
      this.editFirstName = this.employee[i].firstName;
      this.editEmail = this.employee[i].email;
      this.editLastName = this.employee[i].lastName;
      this.showEmployeeForm = true;
      this.isLoading = false;
    }

    onSubmitChangeEmployeeForm(changeForm){
      this.isLoading = true;
      const formChange = changeForm.value;
      this.editEmail = formChange.emailEdit;
      this.editFirstName = formChange.firstNameEdit;
      this.editLastName = formChange.lastNameEdit;
      this.idEdit = formChange.idEdit;

      const editEmployee = {
          email: this.editEmail,
          firstName: this.editFirstName,
          lastName: this.editLastName
      }

      this.employee[this.employeeToEdit].email = this.editEmail;
      this.employee[this.employeeToEdit].firstName = this.editFirstName;
      this.employee[this.employeeToEdit].lastName = this.editLastName;

      
      
    const url = `https://springbootkeycloak.herokuapp.com/employee/update/${this.idEdit}`;

      this.http.put(url,editEmployee).subscribe(responseData => {});
      this.isLoading = false;
    }

  onDeleteEmployee(deleteForm){
    this.isLoading = true;
    const formDelete = deleteForm.value;
    const email = formDelete.emailDel;
    const url = `https://springbootkeycloak.herokuapp.com/employee/delete/${email}`;

    this.http.delete(url,
      ).subscribe(responseData => {
      });

    if(this.showAll==true) this.showAll = false;
    var contains = false;
    for(var i=0; i<this.employee.length; i++){
      if(this.employee[i].email === email){
      this.employee.splice(i, 1);
      contains = true;
      };
    }
    // if(contains===false) alert("No such Email");
    this.isLoading = false;
  }

  onCreateEmployee(employeeForm){
     this.isLoading = true;

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

        //convert employee object to JSON
        const employeeJson = JSON.stringify(newEmployee);

        //post request to create employee
        this.http.post('https://springbootkeycloak.herokuapp.com/employee/registration',
        newEmployee
        ).subscribe(responseData => {
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
     this.isLoading = false;
  }
}

