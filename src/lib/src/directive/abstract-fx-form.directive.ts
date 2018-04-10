import {AbstractControl} from '@angular/forms';
import {EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import {SubscriberService} from '../service/subscriber.service';

export abstract class AbstractFxDirective implements OnInit, OnDestroy {

  static readonly defaultValidValueChangeDebounce = 400;

  @Input() ngModelValidChangeDebounce = AbstractFxDirective.defaultValidValueChangeDebounce;

  @Output() ngModelValidChange = new EventEmitter();

  ngModelValidValueDebounceStarted = new Subject();

  constructor(protected subscriber: SubscriberService) {
  }

  ngOnInit() {
    this.subscriber.subscribe(this.control.statusChanges,
      v => this.control.valid && !this.control.pristine ? this.ngModelValidValueDebounceStarted.next(v) : null);

    this.subscriber.subscribe(this.control.statusChanges.debounceTime(this.ngModelValidChangeDebounce),
      v => this.control.valid && !this.control.pristine ? this.ngModelValidChange.emit(this.control.value) : null);
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  protected abstract get control(): AbstractControl;
}
