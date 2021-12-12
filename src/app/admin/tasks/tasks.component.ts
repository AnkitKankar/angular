import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/_services/authentication.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.less']
})
export class TasksComponent implements OnInit {
  employeeData: any[]=[];
  taskForm : FormGroup;
  taskData: any[]=[];
  selectedEmployeeId:"";
  displayedColumns: string[] = ['taskId', 'taskdescription', 'assign', 'b1'];
    dataSource:[];
  constructor(private formBuilder:FormBuilder,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      taskname: ['', Validators.required]
  });
 this.authenticationService.viewAllEmployee().subscribe(
   res=>{
    console.log("employee data",res["data"])
    this.employeeData = res["data"];
   }
 )

 this.authenticationService.viewAllTask().subscribe(
  res=>{
   console.log("task data",res["data"])
   this.taskData = res["taskData"]
   this.dataSource = res["taskData"];

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
