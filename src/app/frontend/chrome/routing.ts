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

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '@common/services/guard/auth';
import {ChromeComponent} from './component';

const routes: Routes = [
  {path: '', redirectTo: '/workloads', pathMatch: 'full'},
  {
    path: '',
    component: ChromeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'error',
        loadChildren: () => import('error/module').then(m => m.ErrorModule),
      },

      // Overview
      {
        path: 'overview',
        loadChildren: () => import('overview/module').then(m => m.OverviewModule),
      },

      // Workloads group
      {
        path: 'workloads',
        loadChildren: () => import('resource/workloads/module').then(m => m.WorkloadsModule),
      },
      {
        path: 'pod',
        loadChildren: () => import('resource/workloads/pod/module').then(m => m.PodModule),
      },

      // Config group
      {
        path: 'config',
        loadChildren: () => import('resource/config/module').then(m => m.ConfigModule),
      },
      {
        path: 'configmap',
        loadChildren: () => import('resource/config/configmap/module').then(m => m.ConfigMapModule),
      },
      {
        path: 'secret',
        loadChildren: () => import('resource/config/secret/module').then(m => m.SecretModule),
      },

      // Others
      {
        path: 'settings',
        loadChildren: () => import('settings/module').then(m => m.SettingsModule),
      },
      {
        path: 'about',
        loadChildren: () => import('about/module').then(m => m.AboutModule),
      },
      {
        path: 'log',
        loadChildren: () => import('logs/module').then(m => m.LogsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChromeRoutingModule {}
