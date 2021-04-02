require 'json'
spacing = ENV['SPACING'].to_i
zoom = case spacing
  when 1600
    13
  when 800
    14
  when 400
    15
  when 200
    16
  when 100
    17
  end

while gets
  r = $_.strip.split
  f = {
    :type => :Feature,
    :geometry => {
      :type => :Point,
      :coordinates => [
        r[0].to_f,
        r[1].to_f
      ]
    },
    :properties => {
      :height => r[2].to_f,
      :color => r[4],
      :spacing => spacing / 100
    },
    :tippecanoe => {
      :layer => "asprs#{r[3]}",
      :minzoom => zoom,
      :maxzoom => zoom
    }
  }
  print "\x1e#{JSON.dump(f)}\n"
end

