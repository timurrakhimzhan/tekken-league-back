CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON "Challenge"
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON "User"
    FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON "Match"
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();