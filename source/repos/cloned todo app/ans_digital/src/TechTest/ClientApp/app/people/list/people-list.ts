import { autoinject, bindable } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { Person } from '../models/person';
import { IPerson } from '../interfaces/iperson';

@autoinject
export class PeopleList {

  constructor(private http: HttpClient) { }

  heading = 'People';

  @bindable people: Person[] = [];

  async activate() {
    const response = await this.http.fetch('/people');
    const people = await response.json();

    this.people = people.map((person: IPerson) => new Person(person));
  }
}
