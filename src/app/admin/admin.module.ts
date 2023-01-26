import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EntityListComponent } from "./entity-list/entity-list.component";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { AdminComponent } from "./admin/admin.component";
import { AdminRoutingModule } from "./admin-routing.module";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [EntityListComponent, AdminComponent],
  imports: [
    AdminRoutingModule,
    CommonModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [EntityListComponent],
})
export class AdminModule {}
