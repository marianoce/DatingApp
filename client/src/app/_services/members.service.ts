import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Member } from '../_models/member';
import { of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  members: Member[] = [];
  apiUrl = environment.apiUrl;
  memberCache = new Map();
  userParams: UserParams;
  user: User;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  getUser() {
    return this.user;
  }

  setUser(user: User) {
    this.user = user;
  }

  resetFilters() {
    this.userParams = new UserParams(this.user)
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    var response = this.memberCache.get(Object.values(userParams).join('-'));

    if (response)
      return of(response)
    
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>(this.apiUrl + 'users', params).pipe(map(response => {
      this.memberCache.set(Object.values(userParams).join('-'), response);
    }));
  } 

  getMember(username: string) {
    const member = [...this.memberCache.values()].reduce((arr, elem) => 
      arr.concat(elem.result), []
    ).find((member: Member) => {
      member.userName == username
    });

    if (member)
      return of(member);

    return this.http.get<Member>(this.apiUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.apiUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.apiUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.apiUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.apiUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = this.getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return this.getPaginatedResult<Partial<Member[]>>(this.apiUrl + 'likes', params);
  }

  private getPaginatedResult<T>(url, params) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());

    return params;
  }
}
