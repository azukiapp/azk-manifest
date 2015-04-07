var config = require('../../src/config').get;

import { path, _, async } from 'azk-core';
import { Generator } from '../../src/generator';
import { Manifest } from  '../../src/manifest';

var qfs = require('q-io/fs');

export function extend(h) {

  function socat(port) {
    return "socat TCP4-LISTEN:" + port + ",fork EXEC:`pwd`/src/bashttpd";
  }

  function fixture_path() {
    return h.copyToTmp(h.fixture_path('test-app'));
  }

  h.mockManifestWithContent = function(content) {
    return async(function* () {
      // Copy structure
      var tmp = yield fixture_path();

      // Write content to manifest file
      yield qfs.write(path.join(tmp, config('manifest')), content);

      // Return a new project dir
      return new Manifest(tmp);
    });
  };

  h.mockManifestWithData = function(data) {
    return async(function* () {
      // Copy structure
      var tmp = yield fixture_path();

      // Read and write
      var generator = new Generator({});
      generator.render(data, path.join(tmp, config('manifest')));

      // Return a new project dir
      return new Manifest(tmp);
    });
  };

  h.mockManifest = function(data) {
    var default_img = config('docker:image_default');
    var command   = `${socat('80')} &0>/dev/null ; ${socat('53')} &0>/dev/null ; ${socat('$HTTP_PORT')}`;
    var provision = ["ls -l ./src", "./src/bashttpd", "touch provisioned", "exit 0"];
    var mounts    = {
      '/azk/#{manifest.dir}': '.'
    };
    var mounts_with_persitent = _.merge(mounts, {
      '/data': { type: 'persistent', value: 'data' },
    });

    // Data merge
    data = _.merge({
      systems: {
        example: {
          depends: ["db", "api"],
          workdir: '/azk/#{manifest.dir}',
          image: { docker: default_img },
          mounts: mounts_with_persitent,
          scalable: { default: 3 },
          http: true,
          command, provision,
          envs: {
            ECHO_DATA: "data"
          }
        },
        "example-extends": {
          extends: "example",
          scalable: { default: 1 },
        },
        api: {
          depends: ["db"],
          workdir: '/azk/#{manifest.dir}',
          image: { docker: default_img },
          mounts: mounts,
          scalable: true,
          http: true,
          command, provision,
          envs: {
            ECHO_DATA: "data"
          }
        },
        db: {
          workdir: '/azk/#{manifest.dir}',
          image: { docker: default_img },
          mounts: mounts_with_persitent,
          scalable: false,
          envs: {
            USER: "username",
            PASSWORD: "password",
          },
          ports: {
            http: "5000/tcp",
            dns: "53/tcp",
          },
          export_envs: {
            "#{system.name}_URL": "#{envs.USER}:#{envs.PASSWORD}@#{net.host}:#{net.port.http}"
          },
          command, provision,
        },
        empty: {
          up: false,
          image: { docker: config('docker:image_empty') },
          command: "/bin/false",
        },
        'test-image-opts': {
          image: { docker: default_img },
        },
        'ports-test': {
          image: { docker: config("docker:image_empty") },
          ports: {
            test_tcp: "80/tcp",
            test_udp: "53/udp",
            test_public: "5252:443/tcp",
          },
        },
        'ports-disable': {
          image: { docker: default_img },
          ports: {
            test_tcp: "80/tcp",
            53: null,
          },
        },
        'mount-test': {
          up: false,
          image: { docker: default_img },
          mounts: {
            "/azk/#{system.name}": '.',
            "/azk/root": '/',
            "/azk/not-exists": { type: 'path', value: '../not-exists', required: false },
          },
          docker_extra: {
            start: { Privileged: true }
          }
        },
        'expand-test': {
          up: false,
          image: { docker: default_img },
          provision: [
            "system.name: #{system.name}",
            "system.persistent_folders: #{system.persistent_folders}",
            "manifest.dir: #{manifest.dir}",
            "manifest.path: #{manifest.path}",
            "manifest.project_name: #{manifest.project_name}",
            "azk.version: #{azk.version}",
            "azk.default_domain: #{azk.default_domain}",
            "azk.default_dns: #{azk.default_dns}",
            "azk.balancer_port: #{azk.balancer_port}",
            "azk.balancer_ip: #{azk.balancer_ip}",
          ],
        },
      },
      defaultSystem: 'api',
      bins: [
        { name: "console", command: ["bundler", "exec"] }
      ]
    }, data);

    return h.mockManifestWithData(data);
  };
}
