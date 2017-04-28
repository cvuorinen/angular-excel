import {bootstrap}    from 'angular2/platform/browser'
import {Component}    from 'angular2/core'
import {Excel} from './excel';

@Component({
    selector: 'my-app',
    directives: [Excel],
    template: `<h1>Angular 2 Excel</h1>
               <excel></excel>`
})
class AppComponent { }

bootstrap(AppComponent);
