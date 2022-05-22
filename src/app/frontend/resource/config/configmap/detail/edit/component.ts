// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {ConfigMapDetail} from '@api/root.api';
import {RawResource} from 'common/resources/rawresource';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AlertDialogConfig, AlertDialog} from 'common/dialogs/alert/dialog';
import {MatDialogConfig, MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'kd-configmap-detail-edit',
  templateUrl: './template.html',
  styleUrls: ['./style.scss'],
})
export class ConfigMapDetailEditComponent implements OnInit {
  @Output() onClose = new EventEmitter<boolean>();
  @Input() key: string;

  text = '';

  private configMap_: ConfigMapDetail;
  private editing_ = false;

  @Input() set editing(value: boolean) {
    this.editing_ = value;
    this.updateText_();
  }

  get editing(): boolean {
    return this.editing_;
  }

  @Input() set configMap(value: ConfigMapDetail) {
    this.configMap_ = value;
  }

  get configMap(): ConfigMapDetail {
    return this.configMap_;
  }

  constructor(private readonly dialog_: MatDialog, private readonly http_: HttpClient) {}

  ngOnInit(): void {
    this.updateText_();
  }

  update(): void {
    // Get the latest raw resource, and update it.
    const url = RawResource.getUrl(this.configMap.typeMeta, this.configMap.objectMeta);
    this.http_
      .get(url)
      .toPromise()
      .then((resource: any) => {
        const dataValue = this.text;
        resource.data[this.key] = this.text;
        const url = RawResource.getUrl(this.configMap.typeMeta, this.configMap.objectMeta);
        this.http_.put(url, resource, {headers: this.getHttpHeaders_(), responseType: 'text'}).subscribe(() => {
          // Update current data value for configMap, so refresh isn't needed.
          this.configMap_.data[this.key] = dataValue;
          this.onClose.emit(true);
        }, this.handleErrorResponse_.bind(this));
      });
  }

  cancel(): void {
    this.onClose.emit(true);
  }

  private updateText_(): void {
    this.text = this.configMap && this.key ? this.configMap.data[this.key] : '';
  }

  private getHttpHeaders_(): HttpHeaders {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return headers;
  }

  private handleErrorResponse_(err: HttpErrorResponse): void {
    if (err) {
      const alertDialogConfig: MatDialogConfig<AlertDialogConfig> = {
        width: '630px',
        data: {
          title: err.statusText === 'OK' ? 'Internal server error' : err.statusText,
          message: err.error || 'Could not perform the operation.',
          confirmLabel: 'OK',
        },
      };
      this.dialog_.open(AlertDialog, alertDialogConfig);
    }
  }
}
