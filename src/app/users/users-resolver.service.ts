import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";

import {Observable} from "rxjs";

import {UserDefinition} from "../core/models/user-definition.model";
import {UsersService} from "../core/services/users.service";

@Injectable({
  providedIn: 'root',
})
export class UsersResolverService implements Resolve<UserDefinition>{
  constructor(private readonly usersService: UsersService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    | Observable<UserDefinition>
    | Promise<UserDefinition>
    | UserDefinition {
    console.log('trying');
    return this.usersService.getUser(route.paramMap.get('id'));
  }
}
