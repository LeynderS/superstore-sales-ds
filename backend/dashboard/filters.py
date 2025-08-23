from .repositories import fetchall

def get_categories_with_subcategories():
    sql = """
        SELECT c.id, c.name, sc.id, sc.name
        FROM categories c
        LEFT JOIN sub_categories sc ON sc.category_id = c.id
        ORDER BY c.name, sc.name
    """
    rows = fetchall(sql)
    categories = {}
    for c_id, c_name, sc_id, sc_name in rows:
        if c_id not in categories:
            categories[c_id] = {"id": c_id, "name": c_name, "subcategories": []}
        if sc_id:
            categories[c_id]["subcategories"].append({"id": sc_id, "name": sc_name})
    return list(categories.values())

def get_states_with_cities():
    sql = """
        SELECT s.id, s.name, loc.city
        FROM states s
        LEFT JOIN locations loc ON loc.state_id = s.id
        GROUP BY s.id, s.name, loc.city
        ORDER BY s.name, loc.city
    """
    rows = fetchall(sql)
    states = {}
    for s_id, s_name, city in rows:
        if s_id not in states:
            states[s_id] = {"id": s_id, "name": s_name, "cities": []}
        if city:
            states[s_id]["cities"].append({"name": city})
    return list(states.values())
