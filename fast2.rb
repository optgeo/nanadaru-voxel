require 'json'
spacing = ENV['SPACING'].to_i
zoom = case spacing
  when 0.5
    18
  when 1
    17
  when 2
    16
  when 4
    15
  when 8
    14
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
      :spacing => spacing
    },
    :tippecanoe => {
      :layer => "asprs#{r[3]}",
      :minzoom => zoom,
      :maxzoom => zoom
    }
  }
  print "\x1e#{JSON.dump(f)}\n"
end

