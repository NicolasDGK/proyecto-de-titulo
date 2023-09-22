import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/modules/material/material.module';
import { ListProductsComponent } from './components/list-products/list-products.component';
import { CartComponent } from './components/screens/cart/cart.component';
import { DetailsComponent } from './components/screens/details/details.component';
import { LoginComponent } from './components/screens/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FilterComponent } from './components/filter/filter.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FilterPipe } from './pipes/filter.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { HistoryComponent } from './components/history/history.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ClickedOutsideDirective } from './directives/clicked-outside.directive';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ListProductsComponent,
    CartComponent,
    DetailsComponent,
    LoginComponent,
    FilterComponent,
    FooterComponent,
    FilterPipe,
    HighlightDirective,
    HistoryComponent,
    ClickedOutsideDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule, 
    Ng2SearchPipeModule,
    FormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatAutocompleteModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
