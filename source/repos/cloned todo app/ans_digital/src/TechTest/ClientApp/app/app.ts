import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class App {

  private router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {

    config.options.pushState = true;
    config.title = 'Colours Test';

    config.map([
      { route: '', redirect: '/people' },
      { route: 'people/:id', name: 'person', moduleId: PLATFORM.moduleName('app/people/edit/person-edit'), title: 'Person' },
      { route: 'people', name: 'people', moduleId: PLATFORM.moduleName('app/people/list/people-list'), title: 'People' }
    ]);

    this.router = router;
  }

}
