while gets
  r = $_.strip.split(',')
  #alpha = r[3].to_i == 2 ? 1 : 0.4
  color = [r[4], r[5], r[6]].map{|v| (v.to_f / 256).round.to_s(16)}
  color = "##{color.join}"
  #color = [r[4], r[5], r[6]].map{|v| (v.to_f / 256).round}
  #color = "rgba(#{color.join(',')},#{alpha})"
  print "#{r[0]} #{r[1]} #{r[2]} #{r[3]} #{color}\n"
end
