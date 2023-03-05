import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminComponent } from "./admin/admin.component";
import { EntityListComponent } from "./entity-list/entity-list.component";
import { AdminGuard } from "../auth/admin.guard";
import { CreateContestComponent } from "./create-contest/create-contest.component";
import { ContestComponent } from "../contest/contest.component";
import { ContestListComponent } from "../contest-list/contest-list.component";

const adminRoutes: Routes = [
  {
    path: "",
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: "",
        component: EntityListComponent,
      },
      {
        path: "contests/create",
        component: CreateContestComponent,
      },
      {
        path: "contests/:id",
        component: ContestComponent,
        data: { adminMode: true },
      },
      {
        path: "contests",
        component: ContestListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
