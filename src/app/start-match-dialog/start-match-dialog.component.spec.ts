import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StartMatchDialogComponent } from "./start-match-dialog.component";

describe("StartMatchDialogComponent", () => {
  let component: StartMatchDialogComponent;
  let fixture: ComponentFixture<StartMatchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartMatchDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StartMatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
