import 'isomorphic-fetch';
import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { HttpClient } from 'aurelia-fetch-client';

import 'bulma/css/bulma.css';

declare const IS_DEV_BUILD: boolean; // The value is supplied by Webpack during the build

export function configure(aurelia: Aurelia) {
    
    const http = new HttpClient();
    http.configure(config => {
        config
        .useStandardConfiguration()
        .withDefaults({ headers: { 'Accept': 'application/json' } })
        .withBaseUrl('/api');
    });

    aurelia.use
        .instance(HttpClient, http)
        .standardConfiguration()
        .globalResources(PLATFORM.moduleName('app/shared/colour-names-value-converter'));

    if (IS_DEV_BUILD) {
        aurelia.use.developmentLogging();
    }

    new HttpClient().configure(config => {
        const baseUrl = document.getElementsByTagName('base')[0].href;
        config.withBaseUrl(baseUrl);
    });

    aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app/app')));
}
