import { Component, OnInit } from '@angular/core';
import { Directive, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

import { UploadFileService } from '../../services/upload-file/upload-file.service';
import { RenameFileService } from '../../services/rename-file/rename-file.service';
import { DeleteFileService } from '../../services/delete-file/delete-file.service';

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit, AfterViewInit {
  title = '';
  uploadForm: FormGroup;
  msg = '';
  uploadFileLabel = "Choose file...";
  uploadInProgress = false;
  successMsg = false;
  errorMsg = false;

  constructor(
    private formBuilder: FormBuilder,
    private uploadFileService: UploadFileService,
    private renameFileService: RenameFileService,
    private deleteFileService: DeleteFileService
  ) {
    this.subscribeToDeleteFileObs();
    this.subscribeToDeleteAllFilesObs();
    this.subscribeToRenameFileObs();
  };

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      upload: ['']
    });
  }

  @ViewChild('fileUploadLabel') fileUploadLabel: ElementRef;

  ngAfterViewInit(){ }

  onFileSelect(event: any) {
    if(event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('upload').setValue(file);
    }
  }

  @HostListener("submit", ["$event"])
  uploadFile(event: any) {
    event.preventDefault();
    this.uploadInProgress = true;

    if(this.successMsg == true) {
      this.successMsg = false;
    }

    if(this.errorMsg == true) {
      this.errorMsg = false;
    }

    const formData = new FormData();

    formData.append('file', this.uploadForm.get('upload').value);

    this.uploadFileService.uploadFile(formData)
      .subscribe(
        res => {
          this.uploadInProgress = false;
          this.successMsg = true;
          this.fileUploadLabel.nativeElement.innerHTML = 'Choose file...';
          this.uploadForm.get('upload').setValue('');
          this.msg = res.Success;
        },
        err => {
          let errMsg = err.error;

          this.uploadInProgress = false;
          this.errorMsg = true;
          this.fileUploadLabel.nativeElement.innerHTML = 'Choose file...';
          this.uploadForm.get('upload').setValue('');
          this.msg = errMsg.Error;
        }
      );
  }

  subscribeToDeleteFileObs() {
    this.deleteFileService.fileDeleted$
      .subscribe(
        res => {
          this.successMsg = true;
          this.msg = res.Success;
        },
        err => {
          let errMsg = err.error;

          this.errorMsg = true;
          this.msg = errMsg.Error;
        });
  }

  subscribeToDeleteAllFilesObs() {
    this.deleteFileService.allFilesDeleted$
      .subscribe(
        res => {
          this.successMsg = true;
          this.msg = res.Success;
        },
        err => {
          let errMsg = err.error;

          this.errorMsg = true;
          this.msg = errMsg.Error;
        });
  }

  subscribeToRenameFileObs() {
    this.renameFileService.fileRenamed$
      .subscribe(
        res => {
          this.successMsg = true;
          this.msg = res.Success;
        },
        err => {
          let errMsg = err.error;

          this.errorMsg = true;
          this.msg = errMsg.Error;
        });
  }
}
