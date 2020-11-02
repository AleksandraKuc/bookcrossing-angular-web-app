import {ActivatedRoute} from "@angular/router";

export abstract class DetailsComponent<T> {
  protected details: T;
  protected id: number;

  protected constructor(protected route: ActivatedRoute,
                        // private location: Location
  ) {
    this.id = +this.route.snapshot.paramMap.get('id');
  }

  getDetails(): T {
    return this.details;
  }

  setDetails(details: T): void {
    this.details = details;
  }
}
