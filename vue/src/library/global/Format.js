export default new class Format {
    //有值是true
    NotNull(Params) {
        // Params = Params.trim();
        return (
            Params != undefined &&
                Params.length != undefined ?
                (
                    Params.trim() != '' &&
                    Params != null &&
                    Params.length > 0
                ) : typeof Params == 'number'
        );
    }
    isMail(Params) {
        let regex = /^([a-zA-Z0-9_\.]{3,})+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,3})+$/;
        return regex.test(Params)
    }
    PasswordEnglishNumber(Params) {
        let regex = /^(?=.*[a-z])(?=.*\d)[a-z\d]/;
        return regex.test(Params)
    }
    UserNameSpecialSymbol(Params) {
        let regex = /[^a-zA-Z0-9\u4e00-\u9fa5]/;
        return regex.test(Params)
    }
    ToArray(Object) {
        return Object.values();
    }
    CheckSame(Params1, Params2, ForciblyType = false) {
        if (ForciblyType) {
            return Params1 === Params2 && typeof (Params1) === typeof (Params2);
        } else {
            return Params1 == Params2;
        }
    }
    DeConnection(params) {
        return JSON.parse(JSON.stringify(params));
    }
}
