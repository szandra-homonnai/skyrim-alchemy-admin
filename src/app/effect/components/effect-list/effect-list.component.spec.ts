import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EffectListComponent } from '@app/effect/components/effect-list/effect-list.component';

describe('EffectListComponent', () => {
  let component: EffectListComponent;
  let fixture: ComponentFixture<EffectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EffectListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EffectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
