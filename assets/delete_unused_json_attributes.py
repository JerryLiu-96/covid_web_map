import json
obj  = json.load(open("covid_web_map/assets/us-covid-2020-counts.json"))
obj_list=obj["features"]
for i in range(len(obj_list)):
    #del obj_list[i]["type"]
    #del obj_list[i]["properties"]["county"]     #county could be a useful info
    #del obj_list[i]["properties"]["state"]      #state could be a useful info
    del obj_list[i]["properties"]["fips"]
    del obj_list[i]["properties"]["deaths"]
obj_final={"type":"FeatureCollection", "features":obj_list}
print(len(obj_final))
with open("covid_web_map/assets/covid_count_processed.geojson", "w") as outfile:
    json.dump(obj_final, outfile)
