MINZOOM = 14
MAXZOOM = 18#22
DETAIL = 32 - MAXZOOM
FILES = %w{08OF4060 08OF4061 08OF4070 08OF4071}
SPACINGS = [0.5, 1, 2, 4, 8]

task :download do
  FILES.each {|fn|
    sh [
      "curl -O",
      "https://gic-shizuoka.s3-ap-northeast-1.amazonaws.com/" +
      "2020/LP/00/#{fn}.zip"
    ].join(' ')
    sh "unzip #{fn}.zip"
    sh "las2ogr -f GeoJSONSeq -i #{fn}.las -o #{fn}.shp"
  }
end

task :voxelize do
  SPACINGS.each {|spacing|
    sh "rm -f *-#{spacing}.las"
    FILES.each {|file|
      sh "/home/pi/SpatiumGL/build/bin/lasgrid -i #{file}.las -o #{file}-#{spacing}.las --spacing #{spacing}"
    }
  }
end

task :fast do
  cmd = %w{(}
  SPACINGS.each {|spacing|
    FILES.each {|file|
      cmd.push(
        "las2txt --parse xyzcRGB -i #{file}-#{spacing}.las --stdout |",
        "ruby fast1.rb |",
        "cs2cs +init=epsg:6676 +to +init=epsg:6668 -f %.11f |",
        "SPACING=#{spacing} ruby fast2.rb;"
      )
    }
  }
  cmd.push(
    ")",
    "| tippecanoe -o fast.mbtiles",
    "--force",
    "--hilbert",
    "--layer=pc",
    "--drop-densest-as-needed",
    "--minimum-zoom=#{MINZOOM}",
    "--maximum-zoom=#{MAXZOOM}",
    "--base-zoom=#{MAXZOOM}",
    "--low-detail=#{10}",
    "--full-detail=#{10}",
    #"--low-detail=#{DETAIL}",
    #"--full-detail=#{DETAIL}",
    "--maximum-tile-features=800000",
    #"--maximum-tile-bytes=1000000",
    "--postfilter='node postfilter.js'",
    "; tile-join",
    "--force",
    "--no-tile-compression",
    "--output-to-directory=docs/zxy",
    "--minimum-zoom=#{MINZOOM}",
    "--maximum-zoom=#{MAXZOOM}",
    "--no-tile-size-limit",
    "fast.mbtiles"
  )
  sh(cmd.join(' '))
end

task :produce do
  s = FILES.map{|fn| "echo #{fn}.shp"}.join('; ')
  sh [
    "(#{s}) | parallel -j1 --line-buffer",
    "'",
      "ogr2ogr -lco RS=YES -f GeoJSONSeq",
      "-select intensity,asprsclass",
      #"-limit 7000000",
      "-s_srs EPSG:6676 -t_srs EPSG:4326",
      "/vsistdout/ {1}",
    "'",
    "| node filter.js",
    "| tippecanoe -o tiles.mbtiles",
    "--force",
    "--hilbert",
    "--layer=pc",
    "--drop-densest-as-needed",
    "--minimum-zoom=12",
    "--maximum-zoom=#{MAXZOOM}",
    "--base-zoom=#{MAXZOOM}",
    #"--full-detail=#{DETAIL}",
    #"--low-detail=#{DETAIL}",
    #"--maximum-tile-features=100000", #200000
    "; tile-join",
    "--force",
    "--no-tile-compression",
    "--output-to-directory=docs/zxy",
    "--minimum-zoom=#{MINZOOM}",
    "--maximum-zoom=#{MAXZOOM}",
    "--no-tile-size-limit",
    "tiles.mbtiles"
  ].join(' ')
end

task :optimize do
  sh "node ~/vt-optimizer/index.js -m fast.mbtiles"
end

task :style do
  sh "parse-hocon hocon/style-color.conf > docs/style.json"
  sh "gl-style-validate docs/style.json"
end

task :host do
  sh "budo -d docs"
end

