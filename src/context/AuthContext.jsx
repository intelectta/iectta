import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../data/db.js";
import CryptoJS from "crypto-js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  // 🔄 Carrega usuários do banco
  useEffect(() => {
    db.users.toArray().then(setUsers);
  }, []);

  const login = async (email, password) => {
    const found = await db.users.where("email").equals(email).first();
    if (found) {
      const decrypted = CryptoJS.AES.decrypt(found.password, "stellar_key").toString(CryptoJS.enc.Utf8);
      if (decrypted === password) {
        setUser(found);
        return true;
      }
    }
    return false;
  };

  const logout = () => setUser(null);

  const createUser = async (name, email, password, role = "user") => {
    const encrypted = CryptoJS.AES.encrypt(password, "stellar_key").toString();
    const id = await db.users.add({ name, email, password: encrypted, role });
    setUsers(await db.users.toArray());
    return id;
  };

  // Cria usuário admin inicial
  useEffect(() => {
    db.users.count().then(count => {
      if (count === 0) {
        createUser("Administrador", "admin@stellar.com", "1234", "admin");
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, users, login, logout, createUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
