import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {BookDefinition} from "../core/models/book-definition.model";
import {BooksService} from "../core/services/books.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class BooksResolverService implements Resolve<BookDefinition>{
  constructor(private readonly booksService: BooksService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    | Observable<BookDefinition>
    | Promise<BookDefinition>
    | BookDefinition {
    console.log('trying');
    return this.booksService.getBook(route.paramMap.get('id'));
  }
}
