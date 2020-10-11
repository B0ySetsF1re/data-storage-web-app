import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RenameFileService {
  private baseUrl = 'http://localhost:3000/api/data-storage/rename-uploaded-file/';
  private fileRenamedSource = new Subject<any>();

  fileRenamed$ = this.fileRenamedSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  renameFile(id: string, body: any) {
    return this.httpClient.post<any>(`${ this.baseUrl + id}`, body)
      .pipe(
        tap(
          res => {
            this.fileRenamedSource.next(res);
          },
          err => {
            this.fileRenamedSource.next(err);
          }
        )
      );
  }
}
