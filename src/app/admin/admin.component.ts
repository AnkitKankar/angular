import { Component, OnInit } from '@angular/core';
import { first, subscribeOn } from 'rxjs/operators';

import { User } from '@app/_models';
import { AuthenticationService, UserService } from '@app/_services';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TasksComponent } from './tasks/tasks.component';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({ templateUrl: 'admin.component.html' })
export class AdminComponent implements OnInit {
    loading = false;
    users: User[] = [];
    loginForm: FormGroup;
    employeeData: any[]=[];
    taskForm : FormGroup;
    taskData: any[]=[];
    selectedEmployeeId:"";
    displayedColumns: string[] = ['employeeId', 'employeename', 'b1', 'b2'];
    dataSource= new MatTableDataSource<any>();
    constructor(private userService: UserService,private formBuilder:FormBuilder,
        private router:Router,
        private authenticationService: AuthenticationService ,public dialog: MatDialog) { }
        
    ngOnInit() {
        this.loading = true;
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.loading = false;
            this.users = users;
        });
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required]
        });

        this.taskForm = this.formBuilder.group({
            taskname: ['', Validators.required]
        });
       this.authenticationService.viewAllEmployee().subscribe(
         res=>{
          console.log("employee data",res["data"])
          this.employeeData = res["data"];
          this.dataSource = res["data"];
         }
       )

       this.authenticationService.viewAllTask().subscribe(
        res=>{
         console.log("task data",res["data"])
         this.taskData = res["taskData"]
        }
      )

    }
    openDialog(): void {
        const dialogRef = this.dialog.open(TasksComponent,{
            width:'75%',
        
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      }
    getEmployeeData(){
        this.ngOnInit();
    }

    onSubmit(){
        console.log(this.loginForm)
         this.authenticationService.addEmployee(this.loginForm.value['username'])
            .subscribe( data => {
                console.log(data);
               this.getEmployeeData();

                })
            }  
    updateUser(user){
                console.log(user)
                this.authenticationService.updateEmp(user.employeeId).subscribe(res=>{
                    console.log(res)
                })
            }

            removeUser(user){
                console.log(user)
                this.authenticationService.removeEmp(user.employeeId).subscribe(res=>{
                    console.log(res);
                    this.getEmployeeData();
                })
                
            }

            taskSubmit(){
                console.log(this.taskForm)
                this.authenticationService.addTask(this.taskForm.value['taskname'])
            .subscribe( data => {
                console.log(data)
                // this.router.navigate([this.returnUrl]);
                })
                // error => {
                //     this.error = error;
                //     this.loading = false;
                // });
            } 
            assignTask(tsk){
            console.log(tsk)
            console.log(this.selectedEmployeeId)

            this.authenticationService.assignTask(tsk['taskId'],this.selectedEmployeeId['employeeId']).subscribe(res=>{
                console.log("task assigned",res)
            })
            }  
}