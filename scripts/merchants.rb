require 'HTTParty'
require 'csv'
require 'nokogiri'
require 'ap'
require 'active_support/core_ext'

module Merchants

	class WikiScraper

		attr_accessor :noko, :data, :categories

		URL = "http://bitcoin.it/wiki/Trade"

		def initialize()
			@noko = scrape
			@data = []
			@categories = []
		end

		def scrape(live: false)
			# html = live ? HTTParty.get(URL) : File.open("scripts/trade.html").read
			# Edited HTML by hand to include div wrapper, easier to parse
			html = File.open("scripts/trade.html").read
			@noko = Nokogiri::HTML(html)
		end

		def parse
			# .cat is custom class added by hand, wrapper div around category
			@noko.css(".cat").each do |cat|

				category = cat.css("h2").text.strip
				current_subcategory = nil

				cat.children.each do |child|
					if child.name == "h3"
						current_subcategory = child.css("span").text
					end

					links = child.css(".external")

					if !links.empty?
						links.each do |l|
							@data << {
								name: l.text,
								url: l.attr("href"),
								description: l.parent.text.strip,
								category: category,
								subcategory: current_subcategory
							}
						end
					end

				end
			end
		end

		def get_categories
			@noko.css(".toclevel-1").each do |cat|
				text = cat.css("a")[0].text.match(/\d\s(.+)/)[1]
				obj = {
					category: text,
					subcategory: []
				}

				cat.css(".toclevel-2").each do |t|
					obj[:subcategory] << t.css(".toctext")[0].text
				end

				@categories << obj
			end
		end

		def parser
			@noko.css("")
		end

		def to_json(path: "app/data", name: "merchants", data: @data)
			file = File.open("#{path}/#{name}.json", "w+")
			file.write(data.to_json)
			file.close
		end

	end

	class Handler
		attr_accessor :data, :clean, :new_hash

		def initialize(path: "app/data/merchants_raw.json")
			@data = JSON.parse(File.open(path).read)
		end

		def all
			clean_data
			restructure_data
			save
		end

		def clean_data
			@clean = @data.select do |d|
				regex = /prweb|etsy|500px|onion|openstreetmap|google|facebook|amazon|bitcointalk|soundcloud|opensourcerer|tripadvisor|carbonmade|hotfrog|eff|menupages/
				ap d["name"] if !d["url"].scan(regex).blank?

				!d["alexa"].zero? &&
				d["url"].scan(regex).blank? &&
				d["alexa"].to_i <= 1_000_000
			end
		end

		# def sort_data
		# 	@clean.sort_by do |k, v|
		# 		v
		# 	end
		# end

		def restructure_data
			@new_hash = {}
			@clean.each do |d|
				@new_hash[d["name"]] = d.except("name")
			end
		end

		def save(path: "app/data/merchants.json", data: @new_hash)
			File.open(path, "w+") do |f|
				f.write(data.to_json)
				f.close
			end
		end
	end


end

module Alexa

	class Bulk

		def initialize
			@data = Merchants::Handler.new.data
		end

		def check_all
			@data.each do |d|
				site = d["url"]
				rank = Alexa::Check.new(site).rank
				backup(site, rank)
				d["alexa"] = rank

				to_json
				# sleep 2
			end
		end

		def check_nil
			selected = @data.select {|d| d["alexa"].nil?}

			selected.each do |d|
				site = d["url"]
				rank = Alexa::Check.new(site).rank
				backup(site, rank)
				d["alexa"] = rank

				to_json
				# sleep 2
			end

		end

		def backup(site, rank, file: "app/data/backup")
			msg = "#{site}, #{rank}\n"
			ap msg
			f = File.open(file, "a+")
			f.write(msg)
			f.close
		end

		def to_json(path: "app/data", name: "merchants")
			file = File.open("#{path}/#{name}_alexa.json", "w+")
			file.write(@data.to_json)
			file.close
		end

	end

	class	Check
		include HTTParty
		http_proxy "190.205.217.222", 8080

		attr_accessor :url, :noko, :rank

		def initialize(site)
			@url = "http://www.alexa.com/siteinfo/#{site}"
			@noko = scrape
			@rank = get_rank
		end

		def scrape
			html = self.class.get(@url)
			Nokogiri::HTML(html)
		end

		def get_rank
			rank = @noko.css('.metricsUrl a')[0]
			return 0 unless rank
			rank.text.gsub(",", "").to_i
		end
	end
end
