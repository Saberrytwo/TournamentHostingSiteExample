#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EcsPipelineGithub } from '../lib/cdk-gameset-app-stack';

const app = new cdk.App();
new EcsPipelineGithub(app, 'EcsPipelineGithub', {});
