{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.npm-check-updates
    pkgs.sqlite
    pkgs.pkg-config
    pkgs.libuuid
    pkgs.python3
  ];
}
