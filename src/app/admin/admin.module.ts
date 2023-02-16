import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EntityListComponent } from "./entity-list/entity-list.component";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { AdminComponent } from "./admin/admin.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { MatButtonModule } from "@angular/material/button";
import { CreateContestComponent } from "./create-contest/create-contest.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MtxNativeDatetimeModule } from "@ng-matero/extensions/core";
import { MtxDatetimepickerModule } from "@ng-matero/extensions/datetimepicker";
import { ContestComponent } from "./contest/contest.component";
import { ContestListComponent } from "./contest-list/contest-list.component";

@NgModule({
  declarations: [
    EntityListComponent,
    AdminComponent,
    CreateContestComponent,
    ContestComponent,
    ContestListComponent,
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MtxNativeDatetimeModule,
    MtxDatetimepickerModule,
    FormsModule,
  ],
  exports: [EntityListComponent],
})
export class AdminModule {}
