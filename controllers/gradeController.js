import { db } from '../models/index.js';
import { logger } from '../config/logger.js';
import { gradeModel } from '../models/gradeModel.js';

const create = async (req, res) => {
  try {
    const grade = new gradeModel(req.body);
    await grade.save();
    res.send({ message: `Grade de ${grade.name} inserido com sucesso!` });
    logger.info(`POST /grade - ${JSON.stringify()}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    logger.info(`GET /grade`);
    const allGrades = await gradeModel.find({});
    res.send(allGrades);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;
  try {
    logger.info(`GET /grade - ${id}`);
    const grade = await gradeModel.findById(id);

    if (!grade) {
      res.status(404).send('ID não encontrado!');
    }
    res.send(grade);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findByName = async (req, res) => {
  const name = req.headers.name;
  logger.log(`GET /grade -  ${req.headers}`);
  try {
    logger.info(`GET /grade by name - ${name}`);
    const grade = await gradeModel.find({ name: name });

    if (!grade) {
      res.status(404).send('Nome não encontrado!');
    }
    res.send(grade);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade nome: ' + name });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;

  try {
    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
    const newGrade = await gradeModel.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!newGrade) {
      res.status(404).send('ID não encontrado!');
    }
    res.send(newGrade);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    logger.info(`DELETE /grade - ${id}`);

    const response = await gradeModel.findByIdAndDelete(id);
    if (!response) {
      res.status(404).send('ID não encontrado!');
    } else {
      res.send(response);
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    logger.info(`DELETE /grade`);
    const response = await gradeModel.deleteMany({});
    res.send(response);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default {
  create,
  findAll,
  findOne,
  findByName,
  update,
  remove,
  removeAll,
};
