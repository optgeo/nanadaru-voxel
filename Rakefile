MAXZOOM = 22
DETAIL = 32 - MAXZOOM

task :download do
  sh [
    "curl -O",
    "https://gic-shizuoka.s3-ap-northeast-1.amazonaws.com/" +
    "2020/LP/00/08OF4060.zip"
  ].join(' ')
  sh "unzip 08OF4060.zip"
  sh "las2ogr -f GeoJSONSeq -i 08OF4060.las -o 08OF4060.shp"
end

task :produce do
  sh [
    "ogr2ogr -lco RS=YES -f GeoJSONSeq",
    #"-limit 7000000",
    "-s_srs EPSG:6676 -t_srs EPSG:4326",
    "/vsistdout/ 08OF4060.shp",
    "| node filter.js",
    "| tippecanoe -o tiles.mbtiles",
    "--force",
    "--hilbert",
    "--layer=pc",
    "--drop-densest-as-needed",
    "--minimum-zoom=12",
    "--maximum-zoom=#{MAXZOOM}",
    "--base-zoom=#{MAXZOOM}",
    "--full-detail=#{DETAIL}",
    "--low-detail=#{DETAIL}",
    "--maximum-tile-features=200000",
    "; tile-join",
    "--force",
    "--no-tile-compression",
    "--output-to-directory=docs/zxy",
    "--minimum-zoom=12",
    "--maximum-zoom=#{MAXZOOM}",
    "--no-tile-size-limit",
    "tiles.mbtiles"
  ].join(' ')
end

task :optimize do
  sh "node ~/vt-optimizer/index.js -m tiles.mbtiles"
end

task :style do
  sh "parse-hocon hocon/style.conf > docs/style.json"
  sh "gl-style-validate docs/style.json"
end

task :host do
  sh "budo -d docs"
end

